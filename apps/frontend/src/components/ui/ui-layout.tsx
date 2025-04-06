import { ReactNode, Suspense, useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { HStack, VStack, Text, Box, Flex } from '@chakra-ui/react'

export function UiLayout({ children }: { children: ReactNode }) {

  return (
    <Flex justify="center" h="full">
      <VStack 
        maxW="800px" 
        w="100%"
        borderRadius="lg">
        {/* Navbar */}
        <HStack p={4} justifyContent="space-between" w="100%">
          <Text fontSize="xl" fontWeight="bold">CycleBack</Text>
        </HStack>

        {/* Main Content */}
        <Box 
          flex="1" 
          p={6} 
          w="100%" 
          overflowY="auto" 
          // border="1px solid" 
          // borderColor="gray.200"
          // borderRadius="md"
        >
          <Suspense fallback={<Box textAlign="center">Loading...</Box>}>
            {children ? children : <Text color="gray.500" textAlign="center">No content to display!</Text>}
          </Suspense>
        </Box>
        
      </VStack>
      
      {/* Toast notifications */}
      <Toaster position="bottom-right" />
    </Flex>
  )
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show, dialogRef])

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button className="btn btn-xs lg:btn-md btn-primary" onClick={submit} disabled={submitDisabled}>
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode
  title: ReactNode
  subtitle: ReactNode
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? <h1 className="text-5xl font-bold">{title}</h1> : title}
          {typeof subtitle === 'string' ? <p className="py-6">{subtitle}</p> : subtitle}
          {children}
        </div>
      </div>
    </div>
  )
}