<div id="header" align="center">

[![Build Status](https://ci.eclipse.org/che4z/buildStatus/icon?job=che-che4z-explorer-for-zos%2Fdevelopment)](https://ci.eclipse.org/che4z/job/che-che4z-explorer-for-zos/job/development/)

</div>

# z/OS Resource Explorer Extension

z/OS Resource Explorer allows you to remotely view and edit the content of members of partitioned data sets (PDS) within a modern, user-friendly IDE. You can create, copy and delete PDS members, and allocate new data sets copying the parameters of a model data set. You can also configure filters to enable fast indexing of large numbers of data sets, and enable syntax awareness for COBOL text by installing the COBOL Language Support extension.

## **Contents**

- [**Use Cases**](#use-cases)
- [**Prerequisites**](#prerequisites)
- [**User Guide**](#user-guide)
	- [**Hosts**](#hosts)
	- [**Filters**](#filters)
	- [**Actions**](#actions)
	- [**Syntax Awareness**](#syntax-awareness)

## Use Cases

As a modern application developer, you can:

- Use z/OS Resource Explorer to browse and edit mainframe data sets.
- Copy and delete PDS members and allocate data sets using the parameters of an existing data set.
- Create customizable filters including wildcards to produce lists of data sets that match the filter criteria.

## Prerequisites

Before you install the extension for z/OS Resource Explorer, ensure that you meet the following prerequisites:

- Access to Mainframe
- Access to [Zowe](https://www.zowe.org)

## User Guide

### Hosts

To be able to work with z/OS data sets, a host connection to z/OS is required.

Follow these steps:

1. In z/OS Resource Explorer, click Add connection.
2. Fill in the following fields:
	- **URL** (in the format `http://host:port` or `https://host:port`)
	- **Host name** (identifies the mainframe instance)
		> **Note:** Ensure the connection name is unique
	- Mainframe credentials (**username** and **password**)
		> **Note:** The password is only remembered for the session the IDE is opened in. After you restart the IDE you need to provide your password again.
3. Click Save to validate the connection. If the connection is unreachable, or the credentials are invalid, an error message displays.

The host connection displays in the list of hosts on the left hand side of the interface. An expandable list of all data sets with your username as the high level qualifier displays beneath the host.

### Filters

To create a new filter, click the "Add Filter" button next to "Data Sets" under your host connection.

The filter creates a new tree which lists all data sets that match the specified filter string. The filter string can contain wildcards anywhere except on the high level qualifier, which is mandatory. The filter string cannot end with a dot.

### Actions

You can perform the following actions in z/OS Resource Explorer:

- **Browse**
	> Displays the content of a PDS member. You can edit the content but cannot save it.
- **Edit**
	> Displays the content of a PDS member. You can edit the content and save it on the mainframe by selecting **File** - **Save** or **CTRL+S**. To save the file locally, select **File** - **Save As**.
- **Create Member**
	> Creates a new member of a PDS.
- **Allocate Like**
	> Allocates a PDS or physical sequential file using the parameters of an existing data set as a model. The parameters cannot be changed. This functionality is only supported for sequential files that use tracks (TRK) or cylinders (CYL) as the storage unit.
- **Copy**
	> Copies members of a PDS to the same data set or a different data set, on the same host or a different host.
- **Delete**
	> Deletes a member of a PDS.

### Syntax Awareness

While browsing and editing PDS members, syntax awareness for JCL and COBOL files is supported as long as you have an appropriate plugin. The PDS must have the extension .JCL (for a JCL) or .COBOL (for COBOL) for syntax awareness to activate.
