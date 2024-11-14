import GridPattern from "./ui/grid-pattern"
import Image from 'next/image'
import TypingAnimation from './ui/typing-animation'
export default function Landing() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-between bg-gradient text-white p-24">
            <h1 className="text-7xl font-bold text-gradient leading-relaxed">AutoSuggest</h1>
            <TypingAnimation
            className="text-4xl font-bold"
            text="Find the perfect car for YOU!"
            />
            <section className="flex flex-col items-center">
                <Image
                src='https://www.transparentpng.com/thumb/car-png/car-free-transparent-png-8.png'
                alt="Car"
                width={400}
                height={300}
                className="rounded-lg"
                />
            </section>
            <GridPattern
                width={100}
                height={100}
                x={-1}
                y={-1}
                strokeDasharray={"4 2"}
                className={(
                "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
                )}
            />
        </div>
    )
}