import {ObjectUtil} from "./utils/common-utils";

export class GmComponent extends React.Component {
    onUnmounts = [];
    onMounts = [];

    componentDidMount() {
        this.mounted = true;
        this.onMounts.forEach((onMount)=> onMount());
    }
    componentWillUnmount() {
        this.mounted = false;
        this.onUnmounts.forEach((onUnmount)=> onUnmount());
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !ObjectUtil.isEqualsShallow(nextProps, this.props) || nextState != this.state;
    }

    safeUpdate() {
        if (this.mounted) {
            this.forceUpdate();
        }
    }

    onUnmount(f) {
        this.onUnmounts.push(f);
    }
    onMount(f) {
        this.onMounts.push(f);
    }
}