import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { Icon } from "@iconify/react";

type Questiontypes = {
    question: string
    answer: string
}

const SingleQuestion = ({ question, answer }: Questiontypes) => {
    return (
        <div className="col-span-1 px-3">
            <Disclosure as="div" className="mb-4">
                {({ open }) => (
                    <div>
                        <DisclosureButton className="group flex w-full items-center justify-between text-start cursor-pointer bg-Smoke px-1.875 py-1.563 rounded-t-xl">
                            <span className="text-lg text-black">
                                {question}
                            </span>
                            {open ? (
                                <Icon
                                    icon="tabler:minus"
                                    width="20"
                                    height="20"
                                    className="font-semibold text-black sm:block hidden"
                                />
                            ) : (
                                <Icon
                                    icon="tabler:plus"
                                    width="20"
                                    height="20"
                                    className="font-semibold text-black sm:block hidden"
                                />
                            )}
                        </DisclosureButton>
                        <DisclosurePanel
                            transition
                            className="text-lg font-medium bg-Smoke text-black/50 px-1.875 pb-1.563 origin-top transition duration-200 ease-out data-[closed]:-translate-y-6"
                        >
                            {answer}
                        </DisclosurePanel>
                    </div>
                )}
            </Disclosure>
        </div>
    )
}

export default SingleQuestion;