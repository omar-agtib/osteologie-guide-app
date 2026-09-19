import type { ZoneKey } from "../components/3d/SkeletonViewer";

export type CourseDocument = {
  title: string;
  subtitle: string;
  pages: number[];
};

export const COURSE_DOCUMENTS: Partial<
  Record<ZoneKey, CourseDocument>
> = {
  sup: {
    title: "Membre supérieur",
    subtitle: "Travaux pratiques d’anatomie",
    pages: [
      require("../../assets/courses/membre-superieur/page-01.webp"),
      require("../../assets/courses/membre-superieur/page-02.webp"),
      require("../../assets/courses/membre-superieur/page-03.webp"),
      require("../../assets/courses/membre-superieur/page-04.webp"),
      require("../../assets/courses/membre-superieur/page-05.webp"),
      require("../../assets/courses/membre-superieur/page-06.webp"),
      require("../../assets/courses/membre-superieur/page-07.webp"),
      require("../../assets/courses/membre-superieur/page-08.webp"),
      require("../../assets/courses/membre-superieur/page-09.webp"),
      require("../../assets/courses/membre-superieur/page-10.webp"),
      require("../../assets/courses/membre-superieur/page-11.webp"),
      require("../../assets/courses/membre-superieur/page-12.webp"),
      require("../../assets/courses/membre-superieur/page-13.webp"),
      require("../../assets/courses/membre-superieur/page-14.webp"),
      require("../../assets/courses/membre-superieur/page-15.webp"),
      require("../../assets/courses/membre-superieur/page-16.webp"),
      require("../../assets/courses/membre-superieur/page-17.webp"),
      require("../../assets/courses/membre-superieur/page-18.webp"),
      require("../../assets/courses/membre-superieur/page-19.webp"),
      require("../../assets/courses/membre-superieur/page-20.webp"),
      require("../../assets/courses/membre-superieur/page-21.webp"),
      require("../../assets/courses/membre-superieur/page-22.webp"),
      require("../../assets/courses/membre-superieur/page-23.webp"),
      require("../../assets/courses/membre-superieur/page-24.webp"),
      require("../../assets/courses/membre-superieur/page-25.webp"),
      require("../../assets/courses/membre-superieur/page-26.webp"),
      require("../../assets/courses/membre-superieur/page-27.webp"),
      require("../../assets/courses/membre-superieur/page-28.webp"),
    ],
  },
};