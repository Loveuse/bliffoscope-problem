class Component {

    constructor(rows, columns, type, name, sparseMatrix) {
        this.rows = rows;
        this.columns = columns;
        this.type = type;
        this.name = name;
        this.sparseMatrix = sparseMatrix;
    }

    getRows() {
        return this.rows;
    }

    getColumns() {
        return this.columns;
    }

    getType() {
        return this.type;
    }

    getName() {
        return this.name;
    }

    getSparseMatrix() {
        return this.sparseMatrix;
    }

}