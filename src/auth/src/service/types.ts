/**
 * This is what a service-function should return, so one can map it
 * to the endpoint-response
 */
export type ServiceResponse = {
    status: number,
    content: any
}

export class Requirement {

    constructor(
        private _value: any,
    ) { }

    public get getValue() {
        return this._value;
    }

    public bind(func: any): Requirement {
        if (this._value === null)
            return this;

        this._value = func(this._value);
        return this;
    }

    public check(...variables: string[]): Requirement {
        if (this._value !== null)
            for (const variable of variables)
                if (!this._value[variable])
                    this._value = null;

        return this;
    }

}