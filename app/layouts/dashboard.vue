<template>
    <div class="min-h-screen bg-muted/40">
        <aside class="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:block">
            <AppSidebar />
        </aside>

        <header class="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur sm:px-6 lg:hidden">
            <AppLogo />
            <Button
                variant="ghost"
                size="icon"
                class="size-11 rounded-lg"
                aria-label="Open navigation"
                @click="menuOpen = true"
            >
                <Menu aria-hidden="true" class="size-5" />
            </Button>
        </header>

        <DialogRoot v-model:open="menuOpen">
            <DialogPortal>
                <DialogOverlay
                    class="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 lg:hidden"
                />
                <DialogContent
                    class="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r bg-background shadow-xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left duration-200 lg:hidden"
                >
                    <DialogTitle class="sr-only">
                        Navigation
                    </DialogTitle>
                    <DialogDescription class="sr-only">
                        Browse projects and manage your account.
                    </DialogDescription>
                    <AppSidebar />
                    <DialogClose
                        class="absolute right-3 top-2.5 flex size-11 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                        aria-label="Close navigation"
                    >
                        <X aria-hidden="true" class="size-5" />
                    </DialogClose>
                </DialogContent>
            </DialogPortal>
        </DialogRoot>

        <div class="lg:pl-64">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Menu, X } from '@lucide/vue'
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'

const route = useRoute()
const menuOpen = ref(false)

watch(() => route.fullPath, () => {
    menuOpen.value = false
})
</script>
