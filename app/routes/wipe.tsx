import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    setLoading(true);
    files.forEach(async (file) => {
      await fs.delete(file.path);
    });
    await kv.flush();
    loadFiles();
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000)
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <Navbar />
      Authenticated as: {auth.user?.username}
      <div>Existing files:</div>
      <div className="flex flex-col gap-4">
        {files.map((file) => (
          <div key={file.id} className="flex flex-row gap-4">
            <p>{file.name}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={() => handleDelete()}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
        {success && <div className="text-green-700">Files successfully deleted</div>}
      </div>
    </div>
  );
};

export default WipeApp;
