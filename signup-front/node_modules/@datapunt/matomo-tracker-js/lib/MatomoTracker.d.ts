import { AddEcommerceItemParams, RemoveEcommerceItemParams, SetEcommerceViewParams, TrackEcommerceOrderParams, TrackEventParams, TrackLinkParams, TrackPageViewParams, TrackParams, TrackSiteSearchParams, UserOptions } from './types';
declare class MatomoTracker {
    mutationObserver?: MutationObserver;
    constructor(userOptions: UserOptions);
    private initialize;
    enableHeartBeatTimer(seconds: number): void;
    enableLinkTracking(active: boolean): void;
    private trackEventsForElements;
    trackEvents(): void;
    stopObserving(): void;
    trackEvent({ category, action, name, value, ...otherParams }: TrackEventParams): void;
    trackSiteSearch({ keyword, category, count, ...otherParams }: TrackSiteSearchParams): void;
    trackLink({ href, linkType }: TrackLinkParams): void;
    trackPageView(params?: TrackPageViewParams): void;
    addEcommerceItem({ sku, productName, productCategory, productPrice, productQuantity, }: AddEcommerceItemParams): void;
    removeEcommerceItem({ sku }: RemoveEcommerceItemParams): void;
    clearEcommerceCart(): void;
    trackEcommerceOrder({ orderId, orderRevenue, orderSubTotal, taxAmount, shippingAmount, discountOffered, }: TrackEcommerceOrderParams): void;
    trackEcommerceCartUpdate(amount: number): void;
    setEcommerceView({ sku, productName, productCategory, productPrice, }: SetEcommerceViewParams): void;
    setEcommerceCategoryView(productCategory: string): void;
    track({ data, documentTitle, href, customDimensions, }: TrackParams): void;
    /**
     * Pushes an instruction to Matomo for execution, this is equivalent to pushing entries into the `_paq` array.
     *
     * For example:
     *
     * ```ts
     * pushInstruction('setDocumentTitle', document.title)
     * ```
     * Is the equivalent of:
     *
     * ```ts
     * _paq.push(['setDocumentTitle', document.title]);
     * ```
     *
     * @param name The name of the instruction to be executed.
     * @param args The arguments to pass along with the instruction.
     */
    pushInstruction(name: string, ...args: any[]): MatomoTracker;
}
export default MatomoTracker;
//# sourceMappingURL=MatomoTracker.d.ts.map