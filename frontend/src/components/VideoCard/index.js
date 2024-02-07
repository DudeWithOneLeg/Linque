export default function VideoCard({ message }) {
  const result = message.data[0];
  const videoId = result.link.split("v=")[1];
  return (
    <div className="bot-message">
      <a href={result.link} className="link-card" target="_blank">
        <div className="link-card-info">
          <p>{message.body}</p>
          <iframe
            width="400px"
            height="200px"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </a>
    </div>
  );
}
