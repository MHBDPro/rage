import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getSession } from "@/lib/auth/jwt";

const f = createUploadthing();

export const ourFileRouter = {
  sponsorLogo: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getSession();
      if (!session) throw new Error("Unauthorized");
      return { userId: session.username };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
  newsCover: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getSession();
      if (!session) throw new Error("Unauthorized");
      return { userId: session.username };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
