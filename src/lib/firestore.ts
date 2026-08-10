import { arrayUnion, doc, onSnapshot, setDoc } from "firebase/firestore";
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
