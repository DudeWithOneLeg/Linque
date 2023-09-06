export default function ImagesCard({message}) {

    const images = Object.values(message.data.images)

    return (
        <div className="bot-message">
            <p>{message.body}</p>
            <a href={message.data.metaData.google_images_url} className="images-card" target="_blank">
                <div className="image-row">
                    {
                        images.slice(0, 2).map((image) => {
                            return <img src={image.thumbnail} className="image-results" />
                        })
                    }

                </div>
                <div className="image-row">
                    {
                        images.slice(2).map((image) => {
                            return <img src={image.thumbnail} className="image-results" />
                        })
                    }

                </div>
            </a>
        </div>
    )
}
