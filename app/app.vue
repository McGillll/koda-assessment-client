<template>
    <div class="min-h-screen bg-background text-foreground">
        <NuxtRouteAnnouncer />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
        <Toaster position="top-center" rich-colors close-button />
    </div>
</template>
