import { profile } from "@/content/site";

// Closes the last page: the drawing's title block
export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="titleblock mono">
          <span>{profile.name}</span>
          <span>{profile.role}</span>
          <span>{profile.location}</span>
          <span>Rev. 2026.10</span>
        </div>
      </div>
    </footer>
  );
}
