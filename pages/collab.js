import React, { useState } from "react"
import Collab from "../components/collab/Collab"
import { useRouter } from "next/router"
import Modal from "react-modal"
const initInfo = {
	name: "",
	email: "",
	message: "",
	cookies: false,
}
const initIsValid = {
	name: true,
	email: true,
	message: true,
	cookies: true,
}
const collab = () => {
	// Contains the input enetered by user
	const [info, setInfo] = useState(initInfo)
	const [isValid, setIsValid] = useState(initIsValid)
	const router = useRouter()
	// Object that contains text to be displayed depending on language selected

	//Checks if the input has a valid format and changes state acordingly
	const checkInput = () => {
		let response = true
		// Checks message format
		if (info.message.length === 0) {
			setIsValid((prevState) => {
				return { ...prevState, message: false }
			})
			response = false
		}
		// Checks email format
		const email = info.email
		if (!email.includes("@") || email.includes(" ")) {
			setIsValid((prevState) => {
				return { ...prevState, email: false }
			})
			response = false
		}
		// checks name format
		if (info.name === 0) {
			setIsValid((prevState) => {
				return { ...prevState, name: false }
			})
			response = false
		}
		// checks if accept cookies is checked
		if (!info.cookies) {
			setIsValid((prevState) => {
				return { ...prevState, cookies: false }
			})
			response = false
		}

		return response
	}
	// Recollects input on every strike
	const onChangeHandler = (event) => {
		const key = event.target.id
		// If the key is a checkbox, then check chekced status
		if (key === "cookies") {
			setInfo((prevState) => {
				return { ...prevState, cookies: event.target.checked }
			})
		} else {
			const input = {}
			input[key] = event.target.value
			setInfo((prevState) => {
				return { ...prevState, ...input }
			})
			const isKeyValid = {}
			isKeyValid[key] = true
			setIsValid((prevState) => {
				return { ...prevState, ...isKeyValid }
			})
		}
	}
	// Calls checkInput and, if format is right.
	const onSubmitHandler = (event) => {
		event.preventDefault()
		const input = checkInput()
		console.log(info)
		if (input) {
			// Sends the user data to the API
			fetch("/api/contact", {
				method: "POST",
				headers: {
					Accept: "application/json, text/plain, */*",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(info),
			}).then((res) => {
				console.log("El correo se está enviando")
				if (res.status === 200) {
					console.log("Correo enviado")
				}
			})
			// Initializes all states
			setInfo(initInfo)
			setIsValid(initIsValid)
		} else {
			console.log("The form is not right!!!")
		}
	}
	//
	//
	// STYLES OF THE MODAL
	const overlay = {
		background: "radial-gradient(#000000, #00000098)",
		zIndex: "2",
	}
	const content = {
		position: "relative",
		margin: "0 auto",
		width: "fit-content",
		height: "fit-content",
		background: "none",
		border: "none",
		overflow: "visible",
	}
	Modal.setAppElement("#__next")
	return (
		<Modal
			isOpen={true}
			shouldCloseOnEsc={true}
			shouldCloseOnEsc={true}
			onRequestClose={() => {
				router.push("/")
			}}
			style={{ overlay: overlay, content: content }}
		>
			<Collab
				onSubmitHandler={onSubmitHandler}
				onChangeHandler={onChangeHandler}
			></Collab>
		</Modal>
	)
}

export default collab
