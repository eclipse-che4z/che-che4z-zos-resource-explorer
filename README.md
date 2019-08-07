# Explorer for z/OS extension for VS Code

z/OS Explorer for Eclipse Che4z allows you to remotely view and edit the content of physical sequential files and partitioned data sets within a modern, user-friendly IDE. You can create, copy and delete PDS members, and allocate new data sets copying the parameters of a model data set. You can also configure filters to enable fast indexing of large numbers of data sets, and enable syntax highlighting for COBOL text by installing the Eclipse Che4z Language Server Protocol.

## Contents 

- Use Cases
- Prerequisites
- Configuration and Usage Tips
- User Guide
	- Hosts
	- Filters
	- Actions
	
## Use Cases

- As a software engineer, you can use z/OS Explorer to browse and edit mainframe data sets and PDS members. You can also copy and delete PDS members and allocate data sets using the parameters of an existing data set.

- You can also create customizable filters including wildcards to produce lists of data sets that match the filter criteria.

## Prerequisites

Prior to installing the Visual Studio Code extension for z/OS Explorer, ensure that you meet the following prerequisites:

- Access to Mainframe
- Access to Zowe

## Configuration and Usage Tips

- Delete any filters when no longer required. Filters are saved automatically and so the list can become hard to manage.

## User Guide

### Hosts

To be able to work with z/OS data sets, a host connection to z/OS is required.

Follow these steps:

1. In z/OS Explorer, click Add connection.
2. Fill in the following fields:
	- URL (host:port)
	- Connection name (identifies the mainframe instance)
		> **Note:** Ensure the connection name is unique
	- Mainframe credentials (username and password)
		> **Note:** The password is only remembered for the session the IDE is opened in. After you restart the IDE you need to provide your password again.
3. Click Save to validate the connection. If the connection is unreachable, or the credentials are invalid, an error message displays.

The host connection displays in the list of hosts on the left hand side of the interface. An expandable list of all data sets with your username as the high level qualifier displays beneath the host.

### Filters

To create a new filter, click the "Add Filter" button next to "Data Sets" under your host connection.

The filter creates a new tree which lists all data sets that match the specified filter string. The filter string can contain wildcards anywhere except on the high level qualifier, which is mandatory. The filter string cannot end with a dot.

### Actions

You can perform the following actions in z/OS Explorer:

- **Browse**
	> Displays the content of a data set or member. You can edit the content but cannot save it. Syntax highlighting for JCL and COBOL files is supported as long as you have an appropriate plugin.
- **Edit**
	> Displays the content of a data set or member. You can edit the content and save it. Syntax highlighting for JCL and COBOL files is supported as long as you have an appropriate plugin.
- **Create Member**
	> Creates a new member of a PDS.
- **Allocate**
	> Allocates a PDS or physical sequential file using the parameters of an existing data set as a model.
- **Copy**
	> Copies members of a PDS to the same data set or a different data set, on the same host or a different host.
- **Delete**
	> Deletes a member of a PDS.
