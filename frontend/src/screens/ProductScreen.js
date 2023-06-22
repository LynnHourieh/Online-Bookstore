import React from 'react'
import { useParams } from 'react-router-dom'

function ProductScreen() {
    const params=useParams()
   const {title}=params
  return (
    <div>
      
      {title}
    </div>
  )
}

export default ProductScreen
