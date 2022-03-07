// 状态定义
// State definition
const CHAR_LOWER = 0;
const CHAR_UPPER = 1;
const CHAR_DIGIT = 2;
const CHAR_OTHER = 3;

// 行为定义
// Action definition
const OPT_SKIP = 0;
const OPT_APPEND = 1;
const OPT_NEW = 2;

// 状态机
// The state machine
const MOVE_MAP_TYPE_CAMEL_LIKE = [
    [OPT_APPEND, OPT_NEW, OPT_APPEND, OPT_SKIP],
    [OPT_APPEND, OPT_NEW, OPT_APPEND, OPT_SKIP],
    [OPT_NEW, OPT_NEW, OPT_APPEND, OPT_SKIP],
    [OPT_NEW, OPT_NEW, OPT_NEW, OPT_SKIP]
];
const MOVE_MAP_TYPE_SNAKE_LIKE = [
    [OPT_APPEND, OPT_NEW, OPT_APPEND, OPT_SKIP],
    [OPT_APPEND, OPT_APPEND, OPT_APPEND, OPT_SKIP],
    [OPT_NEW, OPT_NEW, OPT_APPEND, OPT_SKIP],
    [OPT_NEW, OPT_NEW, OPT_NEW, OPT_SKIP]
];

export const TYPE_CAMEL_LIKE = 0;
export const TYPE_SNAKE_LIKE = 1;

/**
 * 识别一个字符是大写，小写，还是其他
 * Input one character, identify whether a character is uppercase, lowercase, or otherwise.
 * @param char 字符
 */
function recognizeChar(char: string): number {
    char = char.slice(0, 1);
    if (char >= 'a' && char <= 'z') {
        return CHAR_LOWER;
    } else if (char >= 'A' && char <= 'Z') {
        return CHAR_UPPER;
    } else if (char >= '0' && char <= '9') {
        return CHAR_DIGIT;
    } else {
        return CHAR_OTHER;
    }
}

/**
 * 判断一个输入的标识符是否是类似驼峰的
 * 当输入是大驼峰、小驼峰时，返回0
 * 当输入是大写下划线、小写下划线、小写中划线时，返回1
 * returns 0 if input string belongs to camel case, pascal case
 * returns 1 if input string belongs to constant case, snake case, kebab case
 * @param input 输入的标识符
 * @returns
 */
export function mainTypeRecognize(input: string): number {
    if ((input.toUpperCase() !== input) && (input.toLowerCase() !== input)) {
        return TYPE_CAMEL_LIKE;
    } else {
        return TYPE_SNAKE_LIKE;
    }
}

/**
 * 将输入的标识符转为单词数组
 * Input an identifier, output all words in the identifier.
 * @param input 输入标识符
 */
export function parseIdentifierToWordArray(input: string): string[] {
    const result = [];
    let currentWord = '';
    let lastStatus = CHAR_OTHER;
    let currentStatus = CHAR_OTHER;
    // 根据输入的标识符大类来选择一个状态机
    // Determine which move map is going to use next
    const moveMap = [MOVE_MAP_TYPE_CAMEL_LIKE, MOVE_MAP_TYPE_SNAKE_LIKE][mainTypeRecognize(input)];
    // 用一个标准的状态机把输入切割成若干个单词组成的数组
    // Slice the input into an array of words with a state machine
    for (const c of input) {
        currentStatus = recognizeChar(c);
        const move = moveMap[lastStatus][currentStatus];
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
 * All the valid cases
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
 * Input an identifier and target format, output the identifier under target format.
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
