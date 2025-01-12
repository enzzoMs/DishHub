using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DishHub.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyingMenuItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Category",
                table: "Menus",
                newName: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Menus",
                newName: "Category");
        }
    }
}
