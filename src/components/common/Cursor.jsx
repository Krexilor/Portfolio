// LIBRARIES ---------------------------------------------------------------------------------------------------------------------------------------|
import { useState, useEffect } from 'react'
import { getHoverType } from '../../utils/helpers'

// STYLES ------------------------------------------------------------------------------------------------------------------------------------------|
import '../../styles/components/common/Cursor.css';

// COMPONENT ---------------------------------------------------------------------------------------------------------------------------------------|
const Cursor = ({ isSystemLoading }) => {
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
	const [hoverType, setHoverType] = useState('none')
	const [isClicking, setIsClicking] = useState(false)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const onMouseMove = (e) => {
			setMousePos({ x: e.clientX, y: e.clientY })
			if (!isVisible) setIsVisible(true)
		}
		
		const onMouseDown = () => setIsClicking(true)
		const onMouseUp = () => setIsClicking(false)

		const onMouseOver = (e) => {
			setHoverType(getHoverType(e.target))
		}
		
		window.addEventListener('mousemove', onMouseMove)
		window.addEventListener('mousedown', onMouseDown)
		window.addEventListener('mouseup', onMouseUp)
		window.addEventListener('mouseover', onMouseOver)

		return () => {
			window.removeEventListener('mousemove', onMouseMove)
			window.removeEventListener('mousedown', onMouseDown)
			window.removeEventListener('mouseup', onMouseUp)
			window.removeEventListener('mouseover', onMouseOver)
		}
	}, [isVisible])

	const blades = Array.from({ length: 7 })
	const isTerminal = hoverType === 'terminal'

	return (
		<>
			{isSystemLoading && (
				<style>
					{`* { cursor: none !important; }`}
				</style>
			)}

			<div
				className = {`cursor-container ${isTerminal ? 'terminal-active' : ''}`}
				style = {{
					transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) translate(-50%, -50%)`,
					opacity: isVisible ? 1 : 0,
					zIndex: 10000
				}}
			>
				<div
					className = "cursor-core"
					style = {{ transform: `scale(${isClicking ? 0.6 : 1})`}}
				/>

				<div className = {`blade-system state-${hoverType}`}>
					{blades.map((_, i) => {
						let rotation = i * (360 / 7)
						let opacity = 1
						let translateY = '-8px'

						if (isTerminal) {
							if (i === 0) {
								rotation = 0
								translateY = '-11px'
							} else if (i === 4) {
								rotation = 180
								translateY = '-11px'
							} else {
								opacity = 0
							}
						} else if (hoverType === 'action') {
							translateY = '-13px'
						} else if (hoverType === 'link') {
							translateY = '-11px'
						}
						return (
							<div
								key = {i}
								className = "blade-wrapper"
								style = {{
									opacity: opacity,
									transform: `translate(-50%, -100%) rotate(${rotation}deg) translateY(${isClicking ? '-4px' : translateY})`
								}}
							>
								<svg viewBox = "0 0 20 50" className = "blade-shard">
									<path d = "M10 0 L18 15 L12 50 L8 50 L2 15 Z" />
								</svg>
							</div>
						)
					})}
				</div>
			</div>
		</>
	)
}

// EXPORTS -----------------------------------------------------------------------------------------------------------------------------------------|
export default Cursor