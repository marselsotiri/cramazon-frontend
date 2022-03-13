import { useEffect, useState } from 'react'
import './App.css'

function App() {

  type Item = {
    id: number
    title: string
    image: string
    price: number
  }

  type Order = {
    id: number
    item: Item
    quantity: number
  }

  type User = {
    id: number
    name: string
    email: string
    orders: Order[]
  }

  const [user, setUser] = useState<null | User>(null)

  useEffect(() => {
    fetch('http://localhost:4000/users/marsel@email.com')
      .then(resp => resp.json())
      .then(user => setUser(user))
  }, [])

  if (user === null) return <h1>Loading...</h1>

  let total = 0

  for (const order of user.orders) {
    total += order.quantity * order.item.price
  }

  function deleteOrder(id: number) {
    if (user === null) return

    // remove order from the server
    fetch(`http://localhost:4000/orders/${id}`, { method: 'DELETE' })
      .then(resp => resp.json())
      .then(data => {
        // check if an error came back
        if (data.error) return

        // now we know for sure that data is our updated user
        setUser(data)
      })
  }

  function updateOrder(order: Order) {
    // update order on server
    fetch(`http://localhost:4000/orders/${order.id}`, {
      method: 'PATCH'
    })
    // update state
  }

  return (
    <div className='App'>
      <h1>Hello {user.name}!</h1>
      <h2>Here are your orders:</h2>
      <ul className='order-list'>
        {user.orders.map(order => (
          <li className='order'>
            <div className='image-section'>
              <img src={order.item.image} alt='' />
            </div>
            <div className='info-section'>
              {order.item.title} (£{order.item.price} x {order.quantity})
              <button onClick={() => deleteOrder(order.id)}>X</button>
            </div>
          </li>
        ))}
      </ul>
      <h3>Total: £{total.toFixed(2)}</h3>
    </div>
  )
}

export default App
