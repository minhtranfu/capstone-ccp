<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="en">
<head>
    <jsp:include page="../header.jsp"/>
    <title>CCP Admin</title>
</head>

<body>

<div id="wrapper">

    <!-- Navigation -->
    <jsp:include page="../navigation.jsp"/>

    <div id="page-wrapper">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">User Manage </h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        User Data
                    </div>
                    <!-- /.panel-heading -->
                    <div class="panel-body">
                        <table width="100%" class="table table-striped table-bordered table-hover"
                               id="dataTables-example">
                            <thead>
                            <tr>
                                <th>No</th>
                                <th>Username</th>
                                <th>Company Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Status</th>

                            </tr>
                            </thead>
                            <tbody>
                            <tr class="">
                                <td>Trident</td>
                                <td>Internet Explorer 4.0</td>
                                <td>Win 95+</td>
                                <td class="center">4</td>
                                <td class="center">X</td>
                                <td>Active</td>
                            </tr>
                            <tr class=" ">
                                <td>Trident</td>
                                <td>Internet Explorer 5.0</td>
                                <td>Win 95+</td>
                                <td class="center">5</td>
                                <td class="center">C</td>
                                <td>Active</td>
                            </tr>
                            <tr class="">
                                <td>Trident</td>
                                <td>Internet Explorer 5.5</td>
                                <td>Win 95+</td>
                                <td class="center">5.5</td>
                                <td class="center">A</td>
                                <td>Active</td>
                            </tr>
                            <tr class="even ">
                                <td>Trident</td>
                                <td>Internet Explorer 6</td>
                                <td>Win 98+</td>
                                <td class="center">6</td>
                                <td class="center">A</td>
                                <td>Active</td>
                            </tr>
                            <tr class="odd gradeA">
                                <td>Trident</td>
                                <td>Internet Explorer 7</td>
                                <td>Win XP SP2+</td>
                                <td class="center">7</td>
                                <td class="center">A</td>
                                <td>Deactive</td>
                            </tr>

                            </tbody>
                        </table>
                        <!-- /.table-responsive -->
                    </div>
                    <!-- /.panel-body -->
                </div>
                <!-- /.panel -->
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <!-- /.row -->
    </div>
    <!-- /#page-wrapper -->

</div>
<!-- /#wrapper -->

<jsp:include page="../footer_javascript.jsp"/>

<!-- Page-Level Demo Scripts - Tables - Use for reference -->
<script>
    $(document).ready(function () {
        $('#dataTables-example').DataTable({
            responsive: true
        });
    });
</script>
</body>

</html>
