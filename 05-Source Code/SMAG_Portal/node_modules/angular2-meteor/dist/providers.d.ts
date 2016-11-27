import { Provider, ChangeDetectorRef, DefaultIterableDiffer, IterableDifferFactory, TrackByFn } from '@angular/core';
export declare class DefaultIterableDifferFactory implements IterableDifferFactory {
    constructor();
    supports(obj: Object): boolean;
    create(cdRef: ChangeDetectorRef, trackByFn?: TrackByFn): DefaultIterableDiffer;
}
export declare const METEOR_PROVIDERS: Array<Provider>;
