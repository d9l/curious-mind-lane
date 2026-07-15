import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Board = { id: string; name: string };
type Class = { id: string; board_id: string; class_number: number; title: string };
type Subject = { id: string; class_id: string; name: string };
type Chapter = {
  id: string;
  subject_id: string;
  chapter_number: number;
  title: string;
  display_order: number;
};

type TreeData = {
  boards: Board[];
  classesByBoard: Record<string, Class[]>;
  subjectsByClass: Record<string, Subject[]>;
  chaptersBySubject: Record<string, Chapter[]>;
  chapterParents: Record<string, { subjectId: string; classId: string; boardId: string }>;
};

async function fetchTree(): Promise<TreeData> {
  const [boardsRes, classesRes, subjectsRes, chaptersRes] = await Promise.all([
    supabase.from("boards").select("id, name").order("name"),
    supabase.from("classes").select("id, board_id, class_number, title").order("class_number"),
    supabase.from("subjects").select("id, class_id, name").order("name"),
    supabase
      .from("chapters")
      .select("id, subject_id, chapter_number, title, display_order")
      .eq("is_published", true)
      .order("display_order"),
  ]);
  if (boardsRes.error) throw boardsRes.error;
  if (classesRes.error) throw classesRes.error;
  if (subjectsRes.error) throw subjectsRes.error;
  if (chaptersRes.error) throw chaptersRes.error;

  const classesByBoard: Record<string, Class[]> = {};
  for (const c of classesRes.data ?? []) {
    (classesByBoard[c.board_id] ||= []).push(c);
  }
  const subjectsByClass: Record<string, Subject[]> = {};
  const subjectToClass: Record<string, string> = {};
  for (const s of subjectsRes.data ?? []) {
    (subjectsByClass[s.class_id] ||= []).push(s);
    subjectToClass[s.id] = s.class_id;
  }
  const classToBoard: Record<string, string> = {};
  for (const c of classesRes.data ?? []) classToBoard[c.id] = c.board_id;

  const chaptersBySubject: Record<string, Chapter[]> = {};
  const chapterParents: TreeData["chapterParents"] = {};
  for (const ch of chaptersRes.data ?? []) {
    (chaptersBySubject[ch.subject_id] ||= []).push(ch);
    const classId = subjectToClass[ch.subject_id];
    const boardId = classId ? classToBoard[classId] : undefined;
    if (classId && boardId) {
      chapterParents[ch.id] = { subjectId: ch.subject_id, classId, boardId };
    }
  }
  return {
    boards: boardsRes.data ?? [],
    classesByBoard,
    subjectsByClass,
    chaptersBySubject,
    chapterParents,
  };
}

export function LibraryTree({
  selectedChapterId,
  onSelectChapter,
}: {
  selectedChapterId: string | null;
  onSelectChapter: (id: string) => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["library-tree"],
    queryFn: fetchTree,
    staleTime: 60_000,
  });

  const [openBoardId, setOpenBoardId] = useState<string | null>(null);
  const [openClassId, setOpenClassId] = useState<string | null>(null);
  const [openSubjectId, setOpenSubjectId] = useState<string | null>(null);

  // Default: open first board once data loads.
  useEffect(() => {
    if (data && openBoardId === null && data.boards.length > 0) {
      setOpenBoardId(data.boards[0].id);
    }
  }, [data, openBoardId]);

  // When a chapter is selected, keep its parents expanded and collapse siblings.
  useEffect(() => {
    if (!selectedChapterId || !data) return;
    const parents = data.chapterParents[selectedChapterId];
    if (!parents) return;
    setOpenBoardId(parents.boardId);
    setOpenClassId(parents.classId);
    setOpenSubjectId(parents.subjectId);
  }, [selectedChapterId, data]);

  const toggleBoard = (id: string) => {
    setOpenBoardId((cur) => (cur === id ? null : id));
    setOpenClassId(null);
    setOpenSubjectId(null);
  };
  const toggleClass = (id: string) => {
    setOpenClassId((cur) => (cur === id ? null : id));
    setOpenSubjectId(null);
  };
  const toggleSubject = (id: string) => {
    setOpenSubjectId((cur) => (cur === id ? null : id));
  };

  return (
    <nav aria-label="Library" className="text-sm">
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Library
        </p>
      </div>
      {isLoading && (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      )}
      {error && (
        <p className="px-2 text-xs text-destructive">Failed to load library.</p>
      )}
      {data && data.boards.length === 0 && (
        <p className="px-2 text-xs italic text-muted-foreground">No boards yet.</p>
      )}
      {data && (
        <div className="space-y-4">
          {data.boards.map((b) => (
            <BoardBranch
              key={b.id}
              board={b}
              classes={data.classesByBoard[b.id] ?? []}
              subjectsByClass={data.subjectsByClass}
              chaptersBySubject={data.chaptersBySubject}
              open={openBoardId === b.id}
              onToggle={() => toggleBoard(b.id)}
              openClassId={openClassId}
              onToggleClass={toggleClass}
              openSubjectId={openSubjectId}
              onToggleSubject={toggleSubject}
              selectedChapterId={selectedChapterId}
              onSelectChapter={onSelectChapter}
            />
          ))}
        </div>
      )}
    </nav>
  );
}

function Collapsible({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-200 ease-out ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

function BoardBranch({
  board,
  classes,
  subjectsByClass,
  chaptersBySubject,
  open,
  onToggle,
  openClassId,
  onToggleClass,
  openSubjectId,
  onToggleSubject,
  selectedChapterId,
  onSelectChapter,
}: {
  board: Board;
  classes: Class[];
  subjectsByClass: Record<string, Subject[]>;
  chaptersBySubject: Record<string, Chapter[]>;
  open: boolean;
  onToggle: () => void;
  openClassId: string | null;
  onToggleClass: (id: string) => void;
  openSubjectId: string | null;
  onToggleSubject: (id: string) => void;
  selectedChapterId: string | null;
  onSelectChapter: (id: string) => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md px-2 py-1.5 text-left text-foreground hover:bg-muted"
      >
        <span className="grid h-5 w-5 place-items-center rounded bg-primary/10 font-mono text-[10px] font-semibold uppercase text-primary">
          {board.name[0]}
        </span>
        <span className="font-medium capitalize">{board.name}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
            open ? "" : "-rotate-90"
          }`}
        />
      </button>
      <Collapsible open={open}>
        <div className="ml-2 mt-1 space-y-1 border-l border-border pl-3">
          {classes.length === 0 && (
            <p className="px-2 text-xs italic text-muted-foreground">No classes</p>
          )}
          {classes.map((c) => (
            <ClassBranch
              key={c.id}
              classItem={c}
              subjects={subjectsByClass[c.id] ?? []}
              chaptersBySubject={chaptersBySubject}
              open={openClassId === c.id}
              onToggle={() => onToggleClass(c.id)}
              openSubjectId={openSubjectId}
              onToggleSubject={onToggleSubject}
              selectedChapterId={selectedChapterId}
              onSelectChapter={onSelectChapter}
            />
          ))}
        </div>
      </Collapsible>
    </div>
  );
}

function ClassBranch({
  classItem,
  subjects,
  chaptersBySubject,
  open,
  onToggle,
  openSubjectId,
  onToggleSubject,
  selectedChapterId,
  onSelectChapter,
}: {
  classItem: Class;
  subjects: Subject[];
  chaptersBySubject: Record<string, Chapter[]>;
  open: boolean;
  onToggle: () => void;
  openSubjectId: string | null;
  onToggleSubject: (id: string) => void;
  selectedChapterId: string | null;
  onSelectChapter: (id: string) => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="grid w-full grid-cols-[1fr_auto] items-center gap-2 rounded-md px-2 py-1 text-left text-sm text-foreground hover:bg-muted"
      >
        <span>{classItem.title}</span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform ${
            open ? "" : "-rotate-90"
          }`}
        />
      </button>
      <Collapsible open={open}>
        {subjects.length === 0 ? (
          <p className="ml-2 mt-1 px-2 text-xs italic text-muted-foreground">Coming soon</p>
        ) : (
          <div className="ml-2 mt-1 space-y-1 border-l border-border pl-3">
            {subjects.map((s) => (
              <SubjectBranch
                key={s.id}
                subject={s}
                chapters={chaptersBySubject[s.id] ?? []}
                open={openSubjectId === s.id}
                onToggle={() => onToggleSubject(s.id)}
                selectedChapterId={selectedChapterId}
                onSelectChapter={onSelectChapter}
              />
            ))}
          </div>
        )}
      </Collapsible>
    </div>
  );
}

function SubjectBranch({
  subject,
  chapters,
  open,
  onToggle,
  selectedChapterId,
  onSelectChapter,
}: {
  subject: Subject;
  chapters: Chapter[];
  open: boolean;
  onToggle: () => void;
  selectedChapterId: string | null;
  onSelectChapter: (id: string) => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="grid w-full grid-cols-[1fr_auto] items-center gap-2 rounded-md px-2 py-1 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <span>{subject.name}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      <Collapsible open={open}>
        <ul className="ml-2 mt-1 space-y-0.5 border-l border-border pl-3">
          {chapters.length === 0 && (
            <li className="px-2 text-xs italic text-muted-foreground">Coming soon</li>
          )}
          {chapters.map((c) => {
            const active = c.id === selectedChapterId;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onSelectChapter(c.id)}
                  className={`block w-full rounded-md px-2 py-1 text-left text-[13px] transition-colors ${
                    active
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {c.chapter_number}. {c.title}
                </button>
              </li>
            );
          })}
        </ul>
      </Collapsible>
    </div>
  );
}
