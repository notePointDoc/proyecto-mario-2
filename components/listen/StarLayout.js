import React, { useRef, useMemo } from "react"
import * as THREE from "three/src/Three"
import { Canvas, useFrame } from "@react-three/fiber"
import { a } from "@react-spring/three"
// Actual Component

function Stars({ position }) {
	let group = useRef()
	let theta = 0
	useFrame(() => {
		const r = 5 * Math.sin(THREE.Math.degToRad((theta += 0.01)))
		const s = Math.cos(THREE.Math.degToRad(theta * 2))
		group.current.rotation.set(r, r, r)
		group.current.scale.set(s, s, s)
	})
	const [geo, mat, coords] = useMemo(() => {
		const geo = new THREE.SphereBufferGeometry(0.5, 0.5, 0.5)
		const mat = new THREE.MeshBasicMaterial({
			color: new THREE.Color("peachpuff"),
			transparent: true,
		})
		const coords = new Array(1500)
			.fill()
			.map((i) => [
				Math.random() * 800 - 400,
				Math.random() * 800 - 400,
				Math.random() * 800 - 400,
			])
		return [geo, mat, coords]
	}, [])
	return (
		<a.group ref={group} position={position}>
			{coords.map(([p1, p2, p3], i) => (
				<mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
			))}
		</a.group>
	)
}

function Scene() {
	return (
		<>
			<a.spotLight intensity={1.2} color='black' position={[300, 400, 500]} />
			<Stars position={[100, 200, -500]} />
		</>
	)
}
export default function StarLayout() {
	// This tiny spring right here controlls all(!) the animations, one for scroll, the other for mouse movement ...
	return (
		<Canvas
			style={{
				width: "100%",
				height: "100%",
				position: "absolute",
			}}
		>
			<Scene />
		</Canvas>
	)
}
