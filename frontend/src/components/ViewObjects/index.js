import { useState } from "react"
import './index.css'

const objects = {
    'Car': '/images/objects/car.png',
    'Outerwear': '/images/objects/outerwear.png',
    'Pants': '/images/objects/pants.png',
    'Top': '/images/objects/top.png',
    'Sunglasses': '/images/objects/glasses.png',
    'Wheel': '/images/objects/wheel.png',
    'Tire': '/images/objects/wheel.png',
    'Bicycle': '/images/objects/bicycle.png',
    'Bicycle wheel': '/images/objects/bicycle-wheel.png',
    'Shoe': '/images/objects/shoe.png',
    'Footwear': '/images/objects/shoe.png',
    'Airplane': '/images/objects/airplane.png',
    'Helmet': '/images/objects/helmet.png',
    'Video camera': '/images/objects/camera.png',
    'Single-lens reflex camera': '/images/objects/camera.png',
    'Boat': '/images/objects/boat.png',
    'Chair': '/images/objects/chair.png',
    'Luggage & bags': '/images/objects/bag.png',
    'Game controller': '/images/objects/controller.png',
    'Laptop': '/images/objects/laptop.png',
    'Computer keyboard': '/images/objects/keyboard.png',
    'Home appliance': '/images/objects/tool.png',
    'Guitar': '/images/objects/guitar.png',
    'Filing cabinet': '/images/objects/cabinet.png',
}

export default function ViewObjects({ results }) {
    const [showResults, setShowResults] = useState(false)
    const [data, setData] = useState([])
    console.log(results)

    results = JSON.parse(results)

    return (
        <div className="results">
            {
                <div className="objects-container">
                    {
                        Object.values(results).length && Object.values(results).map((object) => {
                            return <div className='objects' onClick={() => {
                                setData(object.matches)
                                setShowResults(true)
                            }}
                            key={object.image}
                            >
                                {
                                    objects[object.name] ? <img src={objects[object.name]} className="object-icons" /> : <p>{object.name}</p>
                                }
                                {/* <img src={object.image}/> */}
                            </div>
                        })
                    }
                </div>

            }
            {
                showResults && <div className="results-container">
                    {
                        data.map((result) => {
                            return <a href={result.link} target='_blank' className="result-card">
                                <img src={result.thumbnail} className="result-image" />

                                <div className="result-info">
                                    <p>{result.title.length > 30 ? result.title.split('').slice(0, 40).join('') + '...' : result.title}</p>
                                    <p className="result-price">{result.price && result.price.value}</p>
                                    <p className="result-source">{result.source}</p>
                                </div>
                            </a>
                        })
                    }
                </div>
            }
        </div>
    )
}
