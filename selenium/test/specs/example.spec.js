import { expect } from '@wdio/globals'

describe('Example.com E2E Tests', () => {
    beforeEach(async () => {
        await browser.url('https://example.com')
        await browser.pause(1000) // Wait for page to load
    })

    it('should display correct page title', async () => {
        const title = await browser.getTitle()
        expect(title).toBe('Example Domain')
    })

    it('should display main heading text', async () => {
        const heading = await $('h1')
        await expect(heading).toBeExisting()
        const headingText = await heading.getText()
        expect(headingText).toBe('Example Domain')
    })

    it('should display domain information paragraph', async () => {
        const paragraph = await $('p')
        await expect(paragraph).toBeExisting()
        const paragraphText = await paragraph.getText()
        expect(paragraphText).toContain('This domain is for use in illustrative examples')
        expect(paragraphText).toContain('You may use this domain in literature')
    })

    it('should have a "More information..." link', async () => {
        const link = await $('a[href*="iana.org"]')
        await expect(link).toBeExisting()
        const linkText = await link.getText()
        expect(linkText).toBe('More information...')
    })

    it('should verify page URL', async () => {
        const currentUrl = await browser.getUrl()
        expect(currentUrl).toBe('https://example.com/')
    })

    it('should verify page contains expected meta information', async () => {
        const metaCharset = await $('meta[charset]')
        await expect(metaCharset).toBeExisting()
        
        const viewportMeta = await $('meta[name="viewport"]')
        await expect(viewportMeta).toBeExisting()
    })

    it('should verify browser capabilities', async () => {
        // WebDriver.ioでは browser.capabilities を使用してブラウザ情報を取得
        const capabilities = browser.capabilities
        console.log('Browser capabilities:', JSON.stringify(capabilities, null, 2))
        
        // ブラウザ名を確認
        if (capabilities.browserName) {
            console.log(`Testing with browser: ${capabilities.browserName}`)
        }
        
        // バージョン情報を確認
        const version = capabilities.browserVersion || capabilities.version
        if (version) {
            console.log(`Browser version: ${version}`)
        }
        
        // ブラウザが正常に動作していることを確認
        const url = await browser.getUrl()
        expect(url).toBe('https://example.com/')
        
        // ページタイトルでブラウザが動作していることを確認
        const title = await browser.getTitle()
        expect(title).toBe('Example Domain')
    })
})
