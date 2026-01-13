export const Regex_Patterns = Object.freeze({
    email: /^[a-zA-Z0-9+]+(?:[.+_-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/,
    indiaMobile: /^[5-9]{1}[0-9]{9}$/,
    otherMobile: /^[0-9]{3,}$/,
    password: /^.{8,}$/,
    common: /^\s*[A-Za-z0-9]*[A-Za-z0-9\s-()&]*[A-Za-z0-9)]\s*$/,
    createPassword: /^.{8,}$/,
    pan: /[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}/,
    gstin: /^(?:01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|29|30|31|32|33|34|35|36|37|38|97|96|99)[a-zA-Z0-9]{13}$/,
    pincode: /[0-9]{6}/,
    onlyDigits: /^\d+$/,
    digitWithTwoDecimal: /^(\d+|\.\d{1,2}|\d+\.\d{0,2})$/,
    allowOnlyDigits: /^(\d{1,3}(,\d{3})*|\d+)?(\.\d{0,2})?$/,
    digitWithFourDecimal: /^(\d+|\.\d{1,2}|\d+\.\d{0,4})$/,
    allowedCharacter:
        /^[A-Za-z0-9\s~`!@#$%^&*()\-_+=\{\}\[\]:|\\;"‘<,>\.\?/]*$/,
    allowedCharacterWithoutSpace:
        /^[A-Za-z0-9~`!@#$%^&*()\-_+=\{\}\[\]:|\\;"‘<,>\.\?/]*$/,
    allowedCharacterWithOneSpace:
        /^(?!.* {2})[A-Za-z0-9~`!@#$%^&*()\-_+=\[\]{}:|\\;"‘<,>.?\/]+(?: [A-Za-z0-9~`!@#$%^&*()\-_+=\[\]{}:|\\;"‘<,>.?\/]+)*\s*$/,
    onlyCharacterAndDigit: /^[A-Za-z0-9]*$/,
    onlyCharacterAndZero: /^[A-Za-z0]*$/,
    allowedPassword:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    atmostTwoDigits: /^\d{0,2}$/,
    name: /^[A-Za-z0-9](?!.* {2})(?:[A-Za-z0-9 ]*[A-Za-z0-9])?$/,
    numberWithMinusDecimal: /[^-\d.]+/g,
    numberWithMinus: /[^-\d]+/g,
    negativeAmount: /[^0-9-]+/g,
    removeSpacialCharFromFirstLetter: /^[^a-zA-Z0-9]+/g,
    stripUnicode: /[^\x00-\x7F]/g,
});

export const regex_validation = (
    type: keyof typeof Regex_Patterns,
    value: string,
) => {
    return Regex_Patterns[type].test(value);
};

type TAllowedCharacterOnlyProps = {
    text: string;
    fun1: () => void;
    type?: keyof typeof Regex_Patterns;
};

export const allowedCharacterOnly = ({
    text,
    fun1,
    type = 'allowedCharacter',
}: TAllowedCharacterOnlyProps) => {
    if (!type) {
        type = 'allowedCharacter';
    }
    if (text) {
        if (regex_validation(type, text)) {
            fun1();
        }
    } else {
        fun1();
    }
};
