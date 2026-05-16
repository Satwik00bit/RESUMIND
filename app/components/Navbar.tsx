import { useEffect, useState } from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const { fs } = usePuterStore();
  const [files, setFiles] = useState<FSItem[]>([]);
  
  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };
  
  useEffect(() => {
    loadFiles();
  }, []);
  
  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">RESUMIND</p>
      </Link>
      <Link to="/upload" className="primary-button w-fit">
        Upload Resume
      </Link>
      {files.length > 0 && (
        <Link to="/wipe" className="primary-button w-fit">
          Wipe App Data
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
