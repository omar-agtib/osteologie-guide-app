import {
  arrayUnion,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { ZoneKey } from "../components/3d/SkeletonViewer";
import { db } from "./firebase";

export type ZoneProgress = {
  viewedBoneIds: string[];
};

export type ProgressMap = Partial<Record<ZoneKey, ZoneProgress>>;

// Live-subscribes to a user's progress across all three zones.
// Calls `onChange` every time any zone's doc updates.
export function subscribeToProgress(
  uid: string,
  onChange: (progress: ProgressMap) => void,
) {
  const zones: ZoneKey[] = ["sup", "ax", "inf"];
  const current: ProgressMap = {};

  const unsubs = zones.map((zone) =>
    onSnapshot(doc(db, "users", uid, "progress", zone), (snap) => {
      current[zone] = snap.exists()
        ? (snap.data() as ZoneProgress)
        : { viewedBoneIds: [] };
      onChange({ ...current });
    }),
  );

  return () => unsubs.forEach((u) => u());
}

// Marks a bone as viewed for a given zone — merges into the array, no duplicates.
export async function markBoneViewed(
  uid: string,
  zone: ZoneKey,
  boneId: string,
) {
  const ref = doc(db, "users", uid, "progress", zone);
  await setDoc(ref, { viewedBoneIds: arrayUnion(boneId) }, { merge: true });
}

export type QuizResult = {
  lastScore: number;
  lastTotal: number;
  lastPercent: number;

  bestScore: number;
  bestTotal: number;
  bestPercent: number;

  attempts: number;
};

export async function saveQuizResult(
  uid: string,
  zone: ZoneKey,
  score: number,
  total: number,
) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  const ref = doc(db, "users", uid, "quizResults", zone);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);

    const previous = snapshot.exists()
      ? (snapshot.data() as Partial<QuizResult>)
      : {};

    const previousBestPercent =
      typeof previous.bestPercent === "number" ? previous.bestPercent : -1;

    const isNewBest = percent > previousBestPercent;

    transaction.set(
      ref,
      {
        lastScore: score,
        lastTotal: total,
        lastPercent: percent,

        bestScore: isNewBest ? score : (previous.bestScore ?? score),

        bestTotal: isNewBest ? total : (previous.bestTotal ?? total),

        bestPercent: isNewBest ? percent : (previous.bestPercent ?? percent),

        attempts: (previous.attempts ?? 0) + 1,

        lastCompletedAt: serverTimestamp(),
      },
      {
        merge: true,
      },
    );
  });

  return {
    score,
    total,
    percent,
  };
}

export function subscribeToQuizResult(
  uid: string,
  zone: ZoneKey,
  onChange: (result: QuizResult | null) => void,
) {
  const ref = doc(
    db,
    "users",
    uid,
    "quizResults",
    zone,
  );

  return onSnapshot(
    ref,
    (snapshot) => {
      if (!snapshot.exists()) {
        onChange(null);
        return;
      }

      onChange(
        snapshot.data() as QuizResult,
      );
    },
    (error) => {
      console.error(
        "Erreur lecture résultat quiz :",
        error,
      );

      onChange(null);
    },
  );
}