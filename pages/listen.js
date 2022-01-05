import React from "react"
import Listen from "../components/listen/Listen"
import StarLayout from "../components/listen/StarLayout"
// PAGE
const listen = ({ trackData }) => {
	return (
		<>
			<Listen trackData={trackData}></Listen>
		</>
	)
}

// API CALL TO GET DISCOS FOR STATIC GENERATION
export async function getStaticProps() {
	var axios = require("axios")
	var qs = require("qs")
	require("dotenv").config()

	const client_id = process.env.CLIENT_ID
	const client_secret = process.env.CLIENT_SECRET
	const auth_token = Buffer.from(
		`${client_id}:${client_secret}`,
		"utf-8"
	).toString("base64")

	// ACTUAL FUNCTION
	const getAuth = async () => {
		try {
			//make post request to SPOTIFY API for access token, sending relavent info
			const token_url = "https://accounts.spotify.com/api/token"
			const data = qs.stringify({ grant_type: "client_credentials" })

			const response = await axios.post(token_url, data, {
				headers: {
					Authorization: `Basic ${auth_token}`,
					"Content-Type": "application/x-www-form-urlencoded",
				},
			})
			//return access token
			return response.data.access_token
		} catch (error) {
			//on fail, log the error in console
			console.log(error)
		}
	}

	//
	// GET ALBUM TRACKS
	const _getAlbums = async (id, token) => {
		const api_album = `https://api.spotify.com/v1/albums/${id}/tracks`
		const response = await axios.get(api_album, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	}

	//
	// Get Artist tracks-Returns array with all the things
	const _getTracks = async (token) => {
		// Request API toke
		// Get albums function
		// Link for api artists
		const api_artist =
			"https://api.spotify.com/v1/artists/1JaWSutBh9WPbhUYaXHcDJ/albums?include_groups=single%2Calbum"
		// API call to get albums of the artist
		const response = await axios.get(api_artist, {
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		})
		const items = response.data.items
		// Array with all albums array
		const albums_id = await items.map((e) => e.id)
		// Initialize arr to push all tracks
		const trackArr = []
		// Push all tracks list generated by _getAlbum into track Arr
		for (const e of albums_id) {
			const item = await _getAlbums(e, token)
			trackArr.push(...item.items)
		}
		return trackArr
	}

	//
	// GET HTTP to get track info
	const _getTrackInfo = async (id, token) => {
		const api_track = `https://api.spotify.com/v1/tracks/${id}`
		const response = await axios.get(api_track, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	}

	//
	// MAIN FUNCTION-Returns arr of track objects
	const trackInfo = async () => {
		const token = await getAuth()
		const trackList = await _getTracks(token)
		const idList = trackList.map((e) => e.id)
		const track_info = []
		for (const e of idList) {
			const item = await _getTrackInfo(e, token)
			const {
				album: { images },
				name,
				preview_url,
			} = item
			track_info.push({ image: images, name: name, preview_url: preview_url })
		}
		return track_info
	}
	const data = await trackInfo()
	//
	// ACTUAL SPOTIFY FETCH

	return {
		props: { trackData: data },
		revalidate: 2000,
	}
}
export default listen
