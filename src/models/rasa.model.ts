export interface RasaModel {
    text: string
    attachment: {
        type: "movie_list" | "single_movie"
        data: any
    }
}