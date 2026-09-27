import PageFade from "../components/page-fade";

// Kept as a Server Component: vinext passes route params to templates, and
// those can't cross into a Client Component as props.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageFade>{children}</PageFade>;
}
