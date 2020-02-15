const CHAR_LOWER = 0;
const CHAR_UPPER = 1;
const CHAR_OTHER = 2;

const OPT_SKIP = 0;
const OPT_APPEND = 1;
const OPT_NEW = 2;

const MOVE_MAP = [
    [OPT_APPEND, OPT_NEW, OPT_SKIP],
    [OPT_APPEND, OPT_APPEND, OPT_SKIP],
    [OPT_NEW, OPT_NEW, OPT_SKIP]
];

/**
 * 识别一个字符是大写，小写，还是其他
 * @param char 字符
 */
function recognizeChar(char: string): number {
    char = char.slice(0, 1);
    if (char >= 'a' && char <= 'z') {
        return CHAR_LOWER;
    } else if (char >= 'A' && char <= 'Z') {
        return CHAR_UPPER;
    } else {
        return CHAR_OTHER;
    }
}

/**
 * 将输入的标识符转为单词数组
 * @param input 输入标识符
 */
function parseIdentifierToWordArray(input: string): string[] {
    const result = [];
    let currentWord = '';
    let lastStatus = CHAR_OTHER;
    let currentStatus = CHAR_OTHER;
    // 用一个标准的状态机把输入切割成若干个单词组成的数组
    for (const c of input) {
        currentStatus = recognizeChar(c);
        const move = MOVE_MAP[lastStatus][currentStatus];
        switch (move) {
            case OPT_NEW:
                if (currentWord !== '') {
                    result.push(currentWord);
                }
                currentWord = c;
                break;
            case OPT_APPEND:
                currentWord += c;
                break;
            case OPT_SKIP:
            default:
                break;
        }
        lastStatus = currentStatus;
    }
    result.push(currentWord);
    return result.map(word => word.toLowerCase());
}

function toCamelWord(word: string): string {
    return word.slice(0, 1).toUpperCase() + word.slice(1);
}

/**
 * 将输入的标识符转为小驼峰形式
 * @param input 输入标识符
 */
export function toCamelCase(input: string): string {
    const words = parseIdentifierToWordArray(input);
    const items = words.map((word, index) => {
        if (index >= 1) {
            return toCamelWord(word);
        } else {
            return word;
        }
    });
    return items.join('');
}

/**
 * 将输入的标识符转为大驼峰形式
 * @param input 输入标识符
 */
export function toPascalCase(input: string): string {
    const words = parseIdentifierToWordArray(input);
    return words.map(word => toCamelWord(word)).join('');
}

/**
 * 将输入的标识符转为常量形式（大写下划线）
 * @param input 输入标识符
 */
export function toConstantCase(input: string): string {
    const words = parseIdentifierToWordArray(input);
    return words.map(word => word.toUpperCase()).join('_');
}

/**
 * 将输入的标识符转为小写下划线
 * @param input 输入标识符
 */
export function toSnakeCase(input: string): string {
    const words = parseIdentifierToWordArray(input);
    return words.join('_');
}

/**
 * 将输入的标识符转为短横线分隔（小写中划线）
 * @param input 输入标识符
 */
export function toKebabCase(input: string): string {
    const words = parseIdentifierToWordArray(input);
    return words.join('-');
}

/**
 * 所有目前支持的命名风格
 */
export const validCases = [
    'CamelCase',
    'PascalCase',
    'ConstantCase',
    'SnakeCase',
    'KebabCase',
];

/**
 * 将输入标识符转换为特定命名风格
 * @param input 输入标识符
 * @param format 输出格式
 */
export default function formatName(input: string, format: string): string {
    switch (format) {
        case 'CamelCase':
            return toCamelCase(input);
        case 'PascalCase':
            return toPascalCase(input);
        case 'ConstantCase':
            return toConstantCase(input);
        case 'SnakeCase':
            return toSnakeCase(input);
        case 'KebabCase':
            return toKebabCase(input);
        default:
            return input;
    }
}
