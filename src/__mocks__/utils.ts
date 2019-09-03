import { Connection } from "../model/Connection";

export async function createPhysicalDocument(
    datasetName: string,
    memberName: string,
    host: Connection,
    content: string,
) {

}

export function validateMemberName(inputValue: string): string | undefined {
    return inputValue;
}
