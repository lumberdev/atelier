import { Carousel } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';

const customTheme: CustomFlowbiteTheme["carousel"] = {
    root: {
        base: "relative h-full w-full",
        leftControl: "absolute top-0 left-0 flex h-full items-center justify-center px-4 focus:outline-none",
        rightControl: "absolute top-0 right-0 flex h-full items-center justify-center px-4 focus:outline-none"
    },
    indicators: {
        active: {
            off: "bg-b4b4b4 hover:bg-b4b4b4 dark:bg-gray-800/50 dark:hover:bg-gray-800",
            on: "w-12 bg-black dark:bg-gray-800"
        },
        base: "h-0.5 w-7",
        wrapper: "absolute bottom-minus-6 left-1/2 w-9/12 flex flex-wrap justify-center gap-2 -translate-x-1/2"
    },
    item: {
        base: "absolute top-1/2 left-1/2 block w-full -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover",
        wrapper: {
            off: "w-full flex-shrink-0 transform cursor-default snap-center",
            on: "w-full flex-shrink-0 transform cursor-grab snap-center"
        }
    },
    control: {
        base: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10",
        icon: "h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6"
    },
    scrollContainer: {
        base: "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth",
        snap: "snap-x"
    }
}

const ImageSlider = ({ imageUrls }) => {
    return (
        <div className="h-80vw">
            <Carousel theme={customTheme}>
                {imageUrls.map((url:string) => (
                    <img src={url} alt="..." />
                ))}
            </Carousel>
        </div>
    )
}

export default ImageSlider;