import './index.css'

export default function ProductsCard({ message }) {

    const results = message.data.slice(0, 4)

    return (
        <div className="bot-message">
            <div className='products-div'>

                <div className="product-row">
                    {
                        results.slice(0, 2).map((product) => {
                            return <a href={product.link} className="product-card" target="_blank">
                                <img src={product.thumbnail} className="product-image" />
                                <div className='product-info'>
                                    <p className="product-title">{product.title}</p>
                                    <p className="product-price">{product.price}</p>
                                    <p className="product-source">{product.source}</p>
                                </div>
                            </a>
                        })
                    }

                </div>
                <div className="product-row">
                    {
                        results.slice(2, 4).map((product) => {
                            return <a href={product.link} className="product-card" target="_blank">
                                <img src={product.thumbnail} className="product-image" />
                                <div className='product-info'>
                                    <p className="product-title">{product.title}</p>
                                    <p className="product-price">{product.price}</p>
                                    <p className="product-source">{product.source}</p>
                                </div>
                            </a>
                        })
                    }
                </div>
            </div>

        </div>
    )
}
