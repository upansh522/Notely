import WorkspaceHeader from "@/components/workspace/header";
import WorkspaceContent from "@/components/workspace/workspace-content";

interface paramsTypes {
  params: Promise<{
    fileId: string;
  }>;
}

const page = async ({ params }: paramsTypes) => {
  const { fileId } = await params;

  return (
    <div>
      <WorkspaceHeader />
      <WorkspaceContent fileId={fileId} />
    </div>
  );
};

export default page;