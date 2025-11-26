export interface OrderModel {
    orderId: string
    movieId: number
    movieTitle: string
    movieImg: string
    cinema: string
    time: string
    hall: number
    quantity: number
    status: 'na' | 'paid' | 'canceled' | 'liked' | 'disliked'
}