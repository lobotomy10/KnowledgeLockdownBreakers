import { useState, type FC } from 'react'
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { translations, type Language } from '@/lib/translations'

type TutorialProps = {
  onClose: () => void;
  language: Language;
}

type TutorialStep = {
  title: string;
  content: string;
  image?: string;
}

export const TutorialOverlay: FC<TutorialProps> = ({ onClose, language }) => {
  const t = translations[language]
  const [currentStep, setCurrentStep] = useState(0)

  const tutorialSteps: TutorialStep[] = [
    {
      title: t.tutorialSteps.welcome.title,
      content: t.tutorialSteps.welcome.content
    },
    {
      title: t.tutorialSteps.tokenEconomy.title,
      content: t.tutorialSteps.tokenEconomy.content
    },
    {
      title: t.tutorialSteps.createCards.title,
      content: t.tutorialSteps.createCards.content
    }
  ]

  const isLastStep = currentStep === tutorialSteps.length - 1

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Step content */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {tutorialSteps[currentStep].title}
          </h2>
          <p className="text-gray-600">
            {tutorialSteps[currentStep].content}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 0}
          >
            {language === 'en' ? 'Previous' : '前へ'}
          </Button>
          <Button
            onClick={() => {
              if (isLastStep) {
                onClose()
              } else {
                setCurrentStep(prev => prev + 1)
              }
            }}
          >
            {isLastStep 
              ? (language === 'en' ? 'Get Started' : '始める')
              : (language === 'en' ? 'Next' : '次へ')}
          </Button>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
