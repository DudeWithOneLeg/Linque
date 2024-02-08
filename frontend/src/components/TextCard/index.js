export default function TextCard({ message }) {
  const result = message.data[0];

  return (
    <div className="bot-message">
      <a href={result.link} className="link-card" target="_blank">
        <div className="link-card-info">
          <p>
            {result.title} - {result.source}
          </p>
          <p>{message.body}</p>
        </div>
      </a>
    </div>
  );
}
