import { Dataset } from "../../model/DSEntities";

/**
 * Create a dummy dataset.
 * @return A dummy dataset.
 */
export function createDummyDataset(): Dataset {
    return {
        allocatedSize: 15,
        allocationUnit: "BLOCK",
        averageBlock: 0,
        blockSize: 6160,
        catalogName: "ICFCAT.MV3B.CATALOGA",
        creationDate: "2017/07/25",
        dataSetOrganization: "PO",
        deviceType: "3390",
        directoryBlocks: 10,
        expirationDate: "2020/07/25",
        migrated: false,
        name: "TEST.DATASET",
        primary: 10,
        recordFormat: "FB",
        recordLength: 80,
        secondary: 5,
        used: 0,
        volumeSerial: "3BP001",
    };
}
