export default function PageTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="pageTitle">
      <p className="eyebrow dark">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}
