// Wraps every page; being a template it re-mounts on each navigation, so the page
// arriving plays its entrance (see .page-enter in globals.css)
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
