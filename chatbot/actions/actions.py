from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests


class ActionHelloWorld(Action):

    def name(self) -> Text:
        return "action_hello_world"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Hello World from actions!")

        return []

class ActionLatestMovies(Action):

    def name(self) -> Text:
        return "action_latest_movies"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://movie.pequla.com/api/movie'
        res = requests.get(url)
        movies = res.json()

        if len(movies) >= 3:
            bot_response = {
                "type": "movie_list",
                "data": movies[-3:]
            }

            dispatcher.utter_message(
            text='Here are some movies:', 
            attachment= bot_response
        )
        else:
            dispatcher.utter_message(text='Not enough movies found')

        return []

class ActionSearchMovies(Action):

    def name(self) -> Text:
        return "action_search_movies"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
            
        criteria = tracker.get_slot("search_criteria")

        if not criteria:
            dispatcher.utter_message("I didn’t catch what movie to search for. Try again")
            return []

        url = 'https://movie.pequla.com/api/movie?search=' + criteria
        res = requests.get(url)
        movies = res.json()

        dispatcher.utter_message(
            text= 'Here are the search results for ' + criteria,
            attachment={
                "type": "movie_list",
                "data": movies
            }
        )

        return []
    

class ActionGenreList(Action):

    def name(self) -> Text:
        return "action_genre_list"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://movie.pequla.com/api/genre'
        res = requests.get(url)


        dispatcher.utter_message(
            text= 'Here are the available genres:',
            attachment={
                "type": "genre_list",
                "data": res.json()
            }
        )

        return []

class ActionActorList(Action):

    def name(self) -> Text:
        return "action_actor_list"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://movie.pequla.com/api/actor'
        res = requests.get(url)


        dispatcher.utter_message(
            text= 'Here are the available actors:',
            attachment={
                "type": "actor_list",
                "data": res.json()
            }
        )

        return []

class ActionDirectorList(Action):

    def name(self) -> Text:
        return "action_director_list"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://movie.pequla.com/api/director'
        res = requests.get(url)


        dispatcher.utter_message(
            text= 'Here are the available directors:',
            attachment={
                "type": "director_list",
                "data": res.json()
            }
        )

        return []
