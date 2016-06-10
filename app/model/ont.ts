export function getOntModel (sequelize: any, DataType: any): any {
  let Ont = sequelize.define('Ont', {
    fsan: { field: 'fsan', type: DataType.STRING },
    model: { field: 'model', type: DataType.STRING },
    serial: { field: 'serial', type: DataType.STRING },
    state: { field: 'state', type: DataType.STRING }
  }, {
    classMethods: {
      associate: function (models: any): void {
        Ont.hasMany(models.Order)
      }
    }
  }, {
    freezeTableName: true
  })

  return Ont
}
