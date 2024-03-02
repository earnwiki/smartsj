export default {
    parcelLockerId: null,
    parcelLockerObject: null,
    showSelectionMap: false,
    locations: [],
    centerLat: null,
    centerLng: null,
    zoom: 5,
    onSelectCallback () {},
    reset () {
        this.parcelLockerId = null;
        this.parcelLockerObject = null;
        this.centerLat = null;
        this.centerLng = null;
        this.zoom = 5;
    }
}