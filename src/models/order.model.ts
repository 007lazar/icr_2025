export interface OrderModel {
    order_id: string
    movie_id: number
    cinema: string
    time: string
    hall: number
    quantity: number
    price: number
    status: 'na' | 'paid' | 'canceled' | 'liked' | 'disliked'
}