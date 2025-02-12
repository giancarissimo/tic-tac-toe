import { useNavigationStore } from "../../store/navigation"
import ArrowButton from "../common/gameNavigation/ArrowButton"

const About = () => {
  const { selectGameMode } = useNavigationStore()
  return (
    <>
      <div className="w-full flex flex-col justify-center items-start gap-8">
        <article className="w-full flex flex-col justify-center items-start gap-4 font-light">
          <p>Built with ReactJs, Tailwindcss, Zustand, NodeJs, ExpressJs, Socket.io and MongoDb.</p>
          <p>If you are curious about how the code was made you can visit it through <a href="https://github.com/giancarissimo/tic-tac-toe" className="text-sky-500 underline">this link.</a></p>
          <p>If you liked the project you can visit <a href="https://github.com/giancarissimo" className="text-sky-500 underline">my website</a> to see more!</p>
        </article>
      </div>
      <ArrowButton action={() => selectGameMode('menu')} />
    </>
  )
}

export default About
