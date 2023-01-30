import { useState } from 'react'
import { uploadImages } from 'apis/upload'
import { createItem } from 'apis/item'
import AdminContainer from 'components/AdminContainer'

const ItemPage = () => {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [price, setPrice] = useState<number>()
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpload = async () => {
    try {
      setLoading(true)
      setMessage('')
      const { data: uploadedImages } = await uploadImages([image])
      await createItem({
        name,
        type,
        price,
        image: uploadedImages?.[0]?.preview || '',
      })
      setMessage('Upload successfully!')
    } catch (error) {
      console.error(error)
      setMessage('There is an error!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminContainer>
      <div className="text-base">
        <div>Upload item here: </div>
        <div>
          <input
            className="border my-2 p-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            className="border my-2 p-2"
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
        <div>
          <input
            className="border my-2 p-2"
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(+e.target.value)}
          />
        </div>
        <div>
          <input
            className="border my-2 p-2"
            placeholder="Image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <div>
          <button className="border py-2 px-3" onClick={handleUpload}>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        <div className="my-2">{message}</div>
      </div>
    </AdminContainer>
  )
}

export default ItemPage
